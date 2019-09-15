import React from 'react'
import { S_Header } from './style'
import { Link } from "react-router-dom";

function Avatar () {
  return (
    <div className="avatar">
      <img src='static/img/avatar.jpg' />
    </div>
  )
}

function Links () {
  return (
    <ul className="links">
      <li>
        <Link to="/lifestorys">Life And Tea</Link>
      </li>
      <li>
        <Link to="/blog">Technique Blog</Link>
      </li>
      <li>
        <Link to="/tool">Useful Tool</Link>
      </li>
      <li>
        <Link to="/contact">Contact Me</Link>
      </li>
    </ul>
  )
}

function Title () {
  return (
    <div className="title">
      <div className="con">
        <h2>Welcome to Kovar's Personal Site</h2>
        <h4>Wisdom Today: "Don't dream it, be it."</h4>
      </div>
    </div>
  )
}

export default function Header () {
  return (
    <S_Header className="row align-center">
      <Avatar />
      <Title />
      <Links />
    </S_Header>
  )
}

