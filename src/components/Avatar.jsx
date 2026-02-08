import { Trophy } from 'lucide-react';

export default function Avatar({ src, name, size = 40, isBestMaster = false, className = '' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <div
        className={`rounded-full overflow-hidden ${
          isBestMaster ? 'ring-2 ring-gold' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt={name || ''}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=dc2626&color=fff&size=${size}`;
          }}
        />
      </div>
      {isBestMaster && (
        <div className="absolute -top-1 -right-1 bg-gold rounded-full p-0.5">
          <Trophy size={size * 0.3} className="text-white" />
        </div>
      )}
    </div>
  );
}
