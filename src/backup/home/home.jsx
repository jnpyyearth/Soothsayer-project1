import logoImage from './assets/Thesoothsayer.png'; 
import './App.css'

function Home() {
  return (
    <>
      <img src={logoImage} alt="logosoothsayer" />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button className="bg-rose-500 hover:bg-rose-700 text-white py-2 px-10 rounded mt-4 ml-3">
        Log out
      </button>
    </>
  )
}

export default Home