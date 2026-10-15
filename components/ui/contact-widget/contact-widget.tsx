"use client"

import { useEffect, useState } from "react"
import styles from "./contact-widget.module.css"

function CommunicationsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M7.5 15.5a5.5 5.5 0 0 1 0-7M4.5 18.5a9.75 9.75 0 0 1 0-13M16.5 8.5a5.5 5.5 0 0 1 0 7M19.5 5.5a9.75 9.75 0 0 1 0 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 6.75A2.75 2.75 0 0 1 7.75 4h8.5A2.75 2.75 0 0 1 19 6.75v5.5A2.75 2.75 0 0 1 16.25 15H11l-4.5 3v-3.2A2.75 2.75 0 0 1 5 12.25v-5.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 9.5h6M9 12h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function WhatsappIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M19.5 11.65a7.5 7.5 0 0 1-11.1 6.57L4.5 19.5l1.3-3.75A7.5 7.5 0 1 1 19.5 11.65Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8.5c.25-.35.5-.35.8-.3l.55 1.4c.1.25.05.45-.1.65l-.45.55c.45.85 1.1 1.5 1.95 1.95l.55-.45c.2-.15.4-.2.65-.1l1.4.55c.05.3.05.55-.3.8-.35.25-.9.45-1.25.35-1.05-.3-2.2-1.05-3.1-1.95S8.4 10.1 8.1 9.05c-.1-.35.1-.9.35-1.25Z" fill="currentColor" />
    </svg>
  )
}

function BotIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="7" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 4v3M8.5 12h.01M15.5 12h.01M9 15h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [])

  return (
    <div className={styles.widget}>
      <div
        id="contact-options"
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <a className={styles.menuItem} href="#chat" tabIndex={isOpen ? 0 : -1}>
          <span className={styles.itemIcon}><ChatIcon /></span>
          <span>Chat</span>
        </a>
        <a
          className={styles.menuItem}
          href="#whatsapp"
          tabIndex={isOpen ? 0 : -1}
        >
          <span className={`${styles.itemIcon} ${styles.whatsapp}`}><WhatsappIcon /></span>
          <span>WhatsApp</span>
        </a>
        <a className={styles.menuItem} href="#chatbot" tabIndex={isOpen ? 0 : -1}>
          <span className={styles.itemIcon}><BotIcon /></span>
          <span>Chatbot</span>
        </a>
      </div>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls="contact-options"
        aria-label={isOpen ? "Cerrar opciones de contacto" : "Abrir opciones de contacto"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <CommunicationsIcon />
      </button>
    </div>
  )
}