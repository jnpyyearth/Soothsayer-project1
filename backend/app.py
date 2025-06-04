import datetime
from datetime import datetime
import pandas as pd 
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # อนุญาตให้ React เรียกใช้ API ได้
# ตั้งค่าไฟล์ CSV
CSV_FILE_PATH = 'Caution_combined.csv'


@app.route('/')
def index():
    return jsonify({"message": "Flask API is running "}), 200

# @app.route('/')
# def index():
#     # อ่านข้อมูลจาก CSV
#     df = pd.read_csv(CSV_FILE_PATH, nrows=2500)
#     # สร้าง HTML table จาก DataFrame
#     table_html = df.to_html(classes="table table-striped table-bordered", index=False)
    
#     return render_template('index.html', data=table_html)

@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        # อ่านข้อมูลจาก CSV
        df = pd.read_csv(CSV_FILE_PATH, nrows=2500)
        
         # แก้ไขค่าที่เป็น NaN ให้เป็น null หรือค่าที่เหมาะสม
        df = df.fillna('null')  # หรือกรอกเป็น '0' หรือค่าอื่นที่เหมาะสม
        
        # แปลงข้อมูล DataFrame เป็น JSON
        data = df.to_dict(orient='records')
        
        # ส่งข้อมูล JSON กลับ
        return jsonify(data)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# @app.route('/update_row', methods=['POST'])
# def update_row():
#     try:
#         # รับข้อมูลจากฟอร์ม (ใช้ request.form[] แทน get() เพื่อบังคับให้มีค่า)
#         row_index = int(request.form['rowIndex'])
#         new_caution = float(request.form['newCaution'])
#         note = request.form.get('note', '').strip()  # ลบช่องว่างส่วนเกิน

#         # อ่าน CSV พร้อมกำหนด dtype เพื่อป้องกันปัญหา mixed types
#         df = pd.read_csv(CSV_FILE_PATH, dtype={'Acknowledge': str, 'Note': str})

#         # ตรวจสอบว่า row_index อยู่ใน DataFrame หรือไม่
#         if row_index not in df.index:
#             return jsonify({"status": "error", "message": "Invalid row index"})

#         # เก็บค่า MODEL และ TIME จากแถวที่เลือก
#         selected_model = df.at[row_index, 'MODEL']
#         selected_time = df.at[row_index, 'TIME']
#         acknowledge_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#         # =============================================
#         # ส่วนที่แก้ไขแล้ว! (เดิมใช้ .at[] ด้วย list ทำให้ error)
#         # วิธีที่ 1: ใช้ .at[] แยกทีละคอลัมน์ (เร็วที่สุด)
#         df.at[row_index, 'Caution'] = new_caution
#         df.at[row_index, 'Acknowledge'] = acknowledge_time
#         df.at[row_index, 'Note'] = note

#         # หรือวิธีที่ 2: ใช้ .loc[] พร้อมกันหลายคอลัมน์
#         # df.loc[row_index, ['Caution', 'Acknowledge', 'Note']] = [new_caution, acknowledge_time, note]
#         # =============================================

#         # หาแถวอื่นที่มี MODEL เดียวกันและเวลาใหม่กว่า (ใช้ Vectorization)
#         mask = (df['MODEL'] == selected_model) & (df['TIME'] > selected_time)
        
#         # อัปเดต Note เฉพาะกรณีมีข้อความใหม่
#         if note:
#             df.loc[mask, 'Note'] = note  # เขียนทับด้วย note ใหม่เลย
        
#         # อัปเดตเวลา Acknowledge สำหรับแถวที่ตรงเงื่อนไข
#         df.loc[mask, 'Acknowledge'] = acknowledge_time

#         # บันทึกไฟล์ CSV (เรียงข้อมูลตาม Caution และ TIME)
#         df = df.sort_values(by=['Caution', 'TIME'], ascending=[False, False])
#         df.to_csv(CSV_FILE_PATH, index=False)

#         return jsonify({
#             "status": "success",
#             "acknowledge_time": acknowledge_time,
#             "note": note
#         })

#     except Exception as e:
#         # เพิ่มรายละเอียด error ใน logging (แนะนำ)
#         print(f"Error in update_row: {str(e)}")
#         return jsonify({"status": "error", "message": f"System error: {str(e)}"})
@app.route('/update_row', methods=['POST'])
def update_row():
    try:
        # รับค่าหลักที่ใช้ระบุตัวแถว
        time = request.form['time']
        model = request.form['model']
        machine = request.form['machine']
        component = request.form['component']
        new_caution = float(request.form['newCaution'])
        note = request.form.get('note', '').strip()

        # โหลดข้อมูล CSV
        df = pd.read_csv(CSV_FILE_PATH, dtype={'Acknowledge': str, 'Note': str})

        # หาแถวที่ตรงกับ key ทั้ง 4 ตัว
        condition = (
            (df['TIME'] == time) &
            (df['MODEL'] == model) &
            (df['MACHINE'] == machine) &
            (df['COMPONENT'] == component)
        )
        matched_rows = df[condition]

        if matched_rows.empty:
            return jsonify({"status": "error", "message": "Row not found."})

        # ถ้ามีมากกว่า 1 แถว ให้ใช้แถวแรก
        row_index = matched_rows.index[0]

        # อัปเดตค่าลงใน DataFrame
        acknowledge_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        df.at[row_index, 'Caution'] = new_caution
        df.at[row_index, 'Note'] = note
        df.at[row_index, 'Acknowledge'] = acknowledge_time

        # อัปเดตแถวอื่นที่มี MODEL เดียวกันและ TIME มากกว่า
        selected_time = df.at[row_index, 'TIME']
        mask = (df['MODEL'] == model) & (df['TIME'] > selected_time)
        if note:
            df.loc[mask, 'Note'] = note
        df.loc[mask, 'Acknowledge'] = acknowledge_time

        # เซฟกลับเข้าไฟล์ CSV
        df = df.sort_values(by=['Caution', 'TIME'], ascending=[False, False])
        df.to_csv(CSV_FILE_PATH, index=False)

        return jsonify({
            "status": "success",
            "acknowledge_time": acknowledge_time,
            "note": note
        })

    except Exception as e:
        print(f"Error in update_row: {str(e)}")
        return jsonify({"status": "error", "message": f"System error: {str(e)}"})
# if __name__ == '__main__':
#     app.run(debug=True)
    
if __name__ == '__main__':
 app.run(debug=True, host='0.0.0.0', port=5000)  # กำหนดให้ใช้ port 5000