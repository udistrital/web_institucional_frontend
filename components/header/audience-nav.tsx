import {
  audienceProfiles,
  institutionalLinks,
} from "@/navegation/audience"
import styles from "./header.module.css"

export default function AudienceNav() {
  return (
    <nav
      aria-label="Servicios para usuarios"
      className={styles.audienceNav}
    >
      <div className={styles.audienceProfiles}>
        {audienceProfiles.map((profile) => (
          <a
            key={profile.href}
            href={profile.href}
            className={styles.audienceLink}
          >
            {profile.label}
          </a>
        ))}
      </div>

      <div className={styles.institutionalLinks}>
        {institutionalLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
