import os
import pandas as pd
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

#CSV file
CSV_FILE_PATH = 'Caution_combined.csv'

#Test api running
@app.route('/')
def index():
    return jsonify({"message": "Flask API is running"}), 200

#fetch api get data 
@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        df = pd.read_csv(CSV_FILE_PATH, nrows=2500)
        df = df.fillna('null')
        data = df.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

#Update data และ สร้างไฟล์ CSV ตามเดือน
@app.route('/update_row', methods=['POST'])
def update_row():
    try:
        time = request.form['time']
        model = request.form['model']
        machine = request.form['machine']
        component = request.form['component']
        new_caution = float(request.form['newCaution'])
        note = request.form.get('note', '').strip()
        acknowledge_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        month_str = datetime.now().strftime("%Y-%m")
        monthly_path = f"Caution_{month_str}.csv"
        combined_path = "Caution_combined.csv"

        if os.path.exists(monthly_path):
            df_month = pd.read_csv(monthly_path, dtype={'Acknowledge': str, 'Note': str})
        else:
            df_month = pd.DataFrame(columns=['TIME', 'MODEL', 'MACHINE', 'COMPONENT', 'Caution', 'Note', 'Acknowledge'])

        condition = (
            (df_month['TIME'] == time) &
            (df_month['MODEL'] == model) &
            (df_month['MACHINE'] == machine) &
            (df_month['COMPONENT'] == component)
        )
        matched_rows = df_month[condition]
        if matched_rows.empty:
            return jsonify({"status": "error", "message": "Row not found in monthly file."})

        row_index = matched_rows.index[0]
        df_month.at[row_index, 'Caution'] = new_caution
        df_month.at[row_index, 'Note'] = note
        df_month.at[row_index, 'Acknowledge'] = acknowledge_time

        selected_time = df_month.at[row_index, 'TIME']
        mask = (df_month['MODEL'] == model) & (df_month['TIME'] > selected_time)
        if note:
            df_month.loc[mask, 'Note'] = note
        df_month.loc[mask, 'Acknowledge'] = acknowledge_time

        df_month = df_month.sort_values(by=['Caution', 'TIME'], ascending=[False, False])
        df_month.to_csv(monthly_path, index=False)

        if os.path.exists(combined_path):
            df_combined = pd.read_csv(combined_path, dtype={'Acknowledge': str, 'Note': str})
        else:
            df_combined = pd.DataFrame(columns=['TIME', 'MODEL', 'MACHINE', 'COMPONENT', 'Caution', 'Note', 'Acknowledge'])

        combined_condition = (
            (df_combined['TIME'] == time) &
            (df_combined['MODEL'] == model) &
            (df_combined['MACHINE'] == machine) &
            (df_combined['COMPONENT'] == component)
        )

        if df_combined[combined_condition].empty:
            new_row = {
                'TIME': time,
                'MODEL': model,
                'MACHINE': machine,
                'COMPONENT': component,
                'Caution': new_caution,
                'Note': note,
                'Acknowledge': acknowledge_time
            }
            df_combined = pd.concat([df_combined, pd.DataFrame([new_row])], ignore_index=True)
        else:
            row_index = df_combined[combined_condition].index[0]
            df_combined.at[row_index, 'Caution'] = new_caution
            df_combined.at[row_index, 'Note'] = note
            df_combined.at[row_index, 'Acknowledge'] = acknowledge_time

        df_combined = df_combined.sort_values(by=['Caution', 'TIME'], ascending=[False, False])
        df_combined.to_csv(combined_path, index=False)

        return jsonify({
            "status": "success",
            "acknowledge_time": acknowledge_time,
            "note": note
        })

    except Exception as e:
        print(f"Error in update_row: {str(e)}")
        return jsonify({"status": "error", "message": f"System error: {str(e)}"})

#แยกข้อมูล แยกไฟล์ CSV ตามเดือน
def split_combined_to_monthly():
    combined_path = 'Caution_combined.csv'
    if not os.path.exists(combined_path):
        print("❌ Caution_combined.csv not found.")
        return

    df = pd.read_csv(combined_path)

    if 'TIME' not in df.columns:
        print("❌ 'TIME' column missing.")
        return

    df['TIME'] = pd.to_datetime(df['TIME'], errors='coerce')
    df = df.dropna(subset=['TIME'])
    df['MONTH'] = df['TIME'].dt.to_period('M').astype(str)

    for month, group in df.groupby('MONTH'):
        output_filename = f'Caution_{month}.csv'
        group = group.drop(columns=['MONTH'])
        group = group.sort_values(by=['Caution', 'TIME'], ascending=[False, False])
        group.to_csv(output_filename, index=False)
        print(f"✅ Exported: {output_filename}")


# รันฟังก์ชัน split_combined_to_monthly() และ flask port
if __name__ == '__main__':
    split_combined_to_monthly()
    app.run(debug=True, host='0.0.0.0', port=5000)
