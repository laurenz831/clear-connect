import React, { useState } from 'react';

// Körperzonen – jeweils mit einem SVG-Pfad und einem lesbaren Namen
const FRONT_PARTS = [
  { id: 'head',          label: 'Kopf',             cx: 50, cy: 12, rx: 13, ry: 12 },
  { id: 'neck',          label: 'Hals',              cx: 50, cy: 27, rx: 6,  ry: 5  },
  { id: 'chest-left',    label: 'Brust links',       cx: 41, cy: 42, rx: 10, ry: 10 },
  { id: 'chest-right',   label: 'Brust rechts',      cx: 59, cy: 42, rx: 10, ry: 10 },
  { id: 'abdomen',       label: 'Bauch',             cx: 50, cy: 58, rx: 12, ry: 9  },
  { id: 'pelvis',        label: 'Becken',            cx: 50, cy: 72, rx: 13, ry: 7  },
  { id: 'shoulder-left', label: 'Schulter links',    cx: 30, cy: 38, rx: 7,  ry: 7  },
  { id: 'shoulder-right',label: 'Schulter rechts',   cx: 70, cy: 38, rx: 7,  ry: 7  },
  { id: 'arm-left',      label: 'Arm links',         cx: 25, cy: 56, rx: 6,  ry: 12 },
  { id: 'arm-right',     label: 'Arm rechts',        cx: 75, cy: 56, rx: 6,  ry: 12 },
  { id: 'leg-left',      label: 'Bein links',        cx: 43, cy: 90, rx: 8,  ry: 14 },
  { id: 'leg-right',     label: 'Bein rechts',       cx: 57, cy: 90, rx: 8,  ry: 14 },
  { id: 'knee-left',     label: 'Knie links',        cx: 43, cy: 107,rx: 7,  ry: 6  },
  { id: 'knee-right',    label: 'Knie rechts',       cx: 57, cy: 107,rx: 7,  ry: 6  },
  { id: 'foot-left',     label: 'Fuß links',         cx: 43, cy: 122,rx: 7,  ry: 5  },
  { id: 'foot-right',    label: 'Fuß rechts',        cx: 57, cy: 122,rx: 7,  ry: 5  },
];

const BACK_PARTS = [
  { id: 'head-back',      label: 'Hinterkopf',       cx: 50, cy: 12, rx: 13, ry: 12 },
  { id: 'neck-back',      label: 'Nacken',           cx: 50, cy: 27, rx: 6,  ry: 5  },
  { id: 'upper-back-l',   label: 'Oberer Rücken li', cx: 41, cy: 40, rx: 10, ry: 10 },
  { id: 'upper-back-r',   label: 'Oberer Rücken re', cx: 59, cy: 40, rx: 10, ry: 10 },
  { id: 'lower-back',     label: 'Unterer Rücken',   cx: 50, cy: 57, rx: 13, ry: 9  },
  { id: 'buttocks',       label: 'Gesäß',            cx: 50, cy: 71, rx: 13, ry: 8  },
  { id: 'arm-left-back',  label: 'Arm links',        cx: 25, cy: 56, rx: 6,  ry: 12 },
  { id: 'arm-right-back', label: 'Arm rechts',       cx: 75, cy: 56, rx: 6,  ry: 12 },
  { id: 'leg-left-back',  label: 'Oberschenkel li',  cx: 43, cy: 90, rx: 8,  ry: 14 },
  { id: 'leg-right-back', label: 'Oberschenkel re',  cx: 57, cy: 90, rx: 8,  ry: 14 },
  { id: 'calf-left',      label: 'Wade links',       cx: 43, cy: 112,rx: 7,  ry: 9  },
  { id: 'calf-right',     label: 'Wade rechts',      cx: 57, cy: 112,rx: 7,  ry: 9  },
];

function BodySVG({ parts, selected, onToggle, label }) {
  return (
    <div className="body-model-view">
      <span className="body-view-label">{label}</span>
      <svg
        viewBox="0 0 100 135"
        className="body-svg"
        style={{ width: 90, height: 122 }}
      >
        {/* Kontur-Körper */}
        <ellipse cx="50" cy="12" rx="13" ry="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="38" y="24" width="24" height="38" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="24" y="25" width="12" height="34" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="64" y="25" width="12" height="34" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="38" y="62" width="11" height="35" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="51" y="62" width="11" height="35" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="38" y="97" width="11" height="30" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="51" y="97" width="11" height="30" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />

        {/* Klickbare Zonen */}
        {parts.map(part => {
          const isSelected = selected.includes(part.id);
          return (
            <ellipse
              key={part.id}
              cx={part.cx}
              cy={part.cy}
              rx={part.rx}
              ry={part.ry}
              fill={isSelected ? 'rgba(220,38,38,0.55)' : 'rgba(37,99,235,0.0)'}
              stroke={isSelected ? '#dc2626' : 'transparent'}
              strokeWidth={isSelected ? 1.5 : 0}
              onClick={() => onToggle(part.id, part.label)}
              style={{ cursor: 'pointer' }}
            >
              <title>{part.label}</title>
            </ellipse>
          );
        })}

        {/* Hover-Overlay via CSS – nur transparente klickbare Flächen */}
        {parts.map(part => (
          <ellipse
            key={`hover-${part.id}`}
            cx={part.cx}
            cy={part.cy}
            rx={part.rx}
            ry={part.ry}
            fill="transparent"
            stroke="transparent"
            onClick={() => onToggle(part.id, part.label)}
            style={{ cursor: 'pointer' }}
            onMouseEnter={e => { if (!selected.includes(part.id)) e.target.setAttribute('fill', 'rgba(37,99,235,0.15)'); }}
            onMouseLeave={e => { if (!selected.includes(part.id)) e.target.setAttribute('fill', 'transparent'); }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BodyModel({ onSelect }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  function toggle(id, label) {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const newLabels = next.map(nid => {
        const all = [...FRONT_PARTS, ...BACK_PARTS];
        return all.find(p => p.id === nid)?.label;
      }).filter(Boolean);
      setSelectedLabels(newLabels);
      if (onSelect) onSelect(newLabels);
      return next;
    });
  }

  function remove(label) {
    const part = [...FRONT_PARTS, ...BACK_PARTS].find(p => p.label === label);
    if (part) toggle(part.id, part.label);
  }

  return (
    <div className="body-model-area">
      <p className="body-model-label">Bitte tippen Sie auf die Stelle, wo Sie Schmerzen haben</p>
      <div className="body-model-views">
        <BodySVG parts={FRONT_PARTS} selected={selectedIds} onToggle={toggle} label="Vorderseite" />
        <BodySVG parts={BACK_PARTS}  selected={selectedIds} onToggle={toggle} label="Rückseite" />
      </div>
      {selectedLabels.length > 0 && (
        <div className="body-selected-parts">
          {selectedLabels.map(l => (
            <div key={l} className="body-part-tag">
              {l}
              <button onClick={() => remove(l)}>&times;</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
