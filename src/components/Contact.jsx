import React from 'react';
import { FaPhone, FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

export default function ContactInfo() {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contacto</h2>

      <div className="contact-item">
        <FaPhone className="contact-icon" />
        <span>+56 9 98829898</span>
      </div>

      <h3 className="social-title">Redes Sociales</h3>
      <div className="social-icons">
        <a href="https://www.instagram.com/dantrottel/" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://www.linkedin.com/in/dantrottel/" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href="https://github.com/Dantrotel" aria-label="Github"><FaGithub /></a>
        <a href="dantrottel@gmail.com" aria-label="Email"><FaEnvelope /></a>
      </div>
    </div>
  );
}
