export default function LoadingSpinner({ size = 40, message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div style={{
        width: size, height: size,
        border: `3px solid rgba(16, 185, 129,0.15)`,
        borderTop: `3px solid #10B981`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {message && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{message}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
