'use client'

/**
 * Selector de colores para cordas — port web del ColorPicker de la app
 * (capoeira-app/components/graduation/ColorPicker.tsx). Misma paleta por
 * familias y mismas reglas: hasta 6 colores, o singleMode para elegir uno
 * (puntas y franjas intermedias).
 */

const COLOR_FAMILIES = [
  {
    label: 'Blancos',
    colors: ['#FFFFFF', '#FAF0E6', '#F5F5F0', '#F0EAD6', '#D3CBBF'],
  },
  {
    label: 'Amarillos',
    colors: ['#FFFF00', '#FFD700', '#FFEB3B', '#FFF59D', '#FFC107', '#FF8F00', '#E1AD01'],
  },
  {
    label: 'Naranjas',
    colors: ['#FF9800', '#FFB74D', '#FF5722', '#E64A19', '#FF7F50', '#B87333'],
  },
  {
    label: 'Rojos',
    colors: ['#FF0000', '#F44336', '#C62828', '#B71C1C', '#880E4F', '#E91E63', '#F06292', '#FF80AB'],
  },
  {
    label: 'Morados',
    colors: ['#800080', '#9C27B0', '#6A1B9A', '#7B1FA2', '#673AB7', '#CE93D8'],
  },
  {
    label: 'Azules',
    colors: ['#0000FF', '#0D47A1', '#001F5B', '#1565C0', '#1976D2', '#2196F3', '#42A5F5', '#81D4FA', '#90CAF9', '#3F51B5'],
  },
  {
    label: 'Teales',
    colors: ['#006064', '#00838F', '#00ACC1', '#00BCD4', '#80DEEA'],
  },
  {
    label: 'Verdes',
    colors: ['#008000', '#1B5E20', '#004D40', '#2E7D32', '#388E3C', '#4CAF50', '#66BB6A', '#A5D6A7', '#8BC34A', '#CDDC39', '#808000'],
  },
  {
    label: 'Marrones',
    colors: ['#3E2723', '#4E342E', '#6D4C41', '#795548', '#A1887F', '#BCAAA4'],
  },
  {
    label: 'Grises y negros',
    colors: ['#B0BEC5', '#90A4AE', '#607D8B', '#546E7A', '#37474F', '#263238', '#212121', '#000000'],
  },
]

// Swatches tan claros que necesitan borde para distinguirse del fondo
const LIGHT_SWATCHES = ['#FFFFFF', '#FAF0E6', '#F5F5F0']

function needsDarkMark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 > 160
}

type Props = {
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
  maxColors?: number
  /** Elegir un color reemplaza al anterior (para puntas/franjas). */
  singleMode?: boolean
}

export default function CordaColorPicker({
  selectedColors,
  onColorsChange,
  maxColors = 6,
  singleMode = false,
}: Props) {
  const isFull = !singleMode && selectedColors.length >= maxColors

  function addColor(hex: string) {
    if (singleMode) {
      onColorsChange([hex])
      return
    }
    if (selectedColors.length >= maxColors) return
    onColorsChange([...selectedColors, hex])
  }

  function removeColor(index: number) {
    const updated = [...selectedColors]
    updated.splice(index, 1)
    onColorsChange(updated)
  }

  return (
    <div>
      <div className="mb-3 flex min-h-[40px] flex-wrap items-center gap-2">
        {selectedColors.length === 0 ? (
          <p className="text-xs italic text-text-muted">Toca un color de la paleta para agregarlo</p>
        ) : (
          selectedColors.map((hex, index) => (
            <button
              key={`${hex}-${index}`}
              type="button"
              onClick={() => removeColor(index)}
              title="Quitar color"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm font-bold shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: hex, color: needsDarkMark(hex) ? '#222' : '#FFF' }}
            >
              ×
            </button>
          ))
        )}
        {!singleMode && (
          <span className="ml-1 text-xs text-text-muted">
            {selectedColors.length}/{maxColors}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {COLOR_FAMILIES.map((family) => (
          <div key={family.label}>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">{family.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {family.colors.map((hex) => {
                const selected = selectedColors.includes(hex)
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => addColor(hex)}
                    disabled={isFull}
                    title={hex}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                      selected ? 'scale-110 shadow-md' : 'hover:scale-105'
                    } ${isFull ? 'cursor-not-allowed opacity-35' : ''} ${
                      LIGHT_SWATCHES.includes(hex) ? 'border-border' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {selected && (
                      <span className="text-xs font-bold" style={{ color: needsDarkMark(hex) ? '#222' : '#FFF' }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
