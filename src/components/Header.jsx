import './Header.css'
import profilePic from '../../public/profile.jpg';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <img src={profilePic} alt="Foto de perfil" className="profile-pic" />
        <h1>Daniel Aguayo</h1>
        <p>Estudiante de Ingeniería de Ejecución en Computación e Informática</p>
        <p>Universidad del Bío-Bío</p>
      </div>
    </header>
  )
}
