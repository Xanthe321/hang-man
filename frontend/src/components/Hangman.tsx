const Hangman = ({ mistakes }: { mistakes: number }) => {
  return (
    <svg height="250" width="200" className="mb-4">
      {/* Darağacı */}
      <line x1="60" y1="20" x2="140" y2="20" stroke="white" strokeWidth="4"/>
      <line x1="140" y1="20" x2="140" y2="50" stroke="white" strokeWidth="4"/>
      <line x1="60" y1="20" x2="60" y2="230" stroke="white" strokeWidth="4"/>
      <line x1="20" y1="230" x2="100" y2="230" stroke="white" strokeWidth="4"/>

      {/* Kafa */}
      {mistakes > 0 && (
        <circle cx="140" cy="70" r="20" stroke="white" strokeWidth="4" fill="none"/>
      )}

      {/* Gövde */}
      {mistakes > 1 && (
        <line x1="140" y1="90" x2="140" y2="150" stroke="white" strokeWidth="4"/>
      )}

      {/* Sol Kol */}
      {mistakes > 2 && (
        <line x1="140" y1="120" x2="120" y2="100" stroke="white" strokeWidth="4"/>
      )}

      {/* Sağ Kol */}
      {mistakes > 3 && (
        <line x1="140" y1="120" x2="160" y2="100" stroke="white" strokeWidth="4"/>
      )}

      {/* Sol Bacak */}
      {mistakes > 4 && (
        <line x1="140" y1="150" x2="120" y2="180" stroke="white" strokeWidth="4"/>
      )}

      {/* Sağ Bacak */}
      {mistakes > 5 && (
        <line x1="140" y1="150" x2="160" y2="180" stroke="white" strokeWidth="4"/>
      )}
    </svg>
  )
}

export default Hangman