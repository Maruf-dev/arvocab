import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1rem',
      }}>📚</div>
      <h1 style={{
        fontSize: '2.4rem',
        marginBottom: '0.5rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #fff, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        AR Vocabulary
      </h1>
      <p style={{
        fontSize: '1.1rem',
        marginBottom: '2.5rem',
        maxWidth: '500px',
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 1.6,
      }}>
        Learn new words in 3D using Augmented Reality.
        Point your camera at a Hiro marker to get started.
      </p>
      <Link href="/ar" style={{
        padding: '14px 36px',
        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
        color: 'white',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1.1rem',
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(108, 99, 255, 0.4)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}>
        🚀 Start Learning
      </Link>
      <p style={{
        marginTop: '2rem',
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.35)',
      }}>
        Requires camera access • Works on mobile &amp; desktop
      </p>
    </main>
  )
}
