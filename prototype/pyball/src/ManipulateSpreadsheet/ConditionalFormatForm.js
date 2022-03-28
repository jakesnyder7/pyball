import React from 'react';

/**
 * Hook to define a form for the application of conditional formatting.
 * @author Claire Wagner
 * @param columnID The id of the column to which to apply the conditional formatting.
 * @param applyFormat A function to apply the conditional formatting.
 * @return The form.
 * Parameters: comparand, column ID, color, and function defining comparison against the comparand.
 */
export function ConditionalFormatForm({columnID, applyFormat}) {

  // options for colors (reference: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
  const colorOptions = React.useMemo(
    () => ({
      red: { label: 'red', textcolor: 'white' },
      maroon: { label: 'maroon', textcolor: 'white' },
      purple: { label: 'purple', textcolor: 'white' },
      magenta: { label: 'magenta', textcolor: 'white' },
      green: { label: 'green', textcolor: 'white' },
      olive: { label: 'olive', textcolor: 'white' },
      teal: { label: 'teal', textcolor: 'white' },
      cyan: { label: 'cyan', textcolor: '#363636' },
      orange: { label: 'orange', textcolor: '#363636' },
      blue: { label: 'blue', textcolor: 'white' },
      yellow: { label: 'yellow', textcolor: '#363636' },
      cornflowerblue: { label: 'cornflower blue', textcolor: '#363636' },
    }),
    []
  );

  // sorted color options
  const sortedColors = React.useMemo(
    () => Object.keys(colorOptions).sort(),
    [colorOptions]
  );

  const [min, setMin] = React.useState(undefined);
  const [max, setMax] = React.useState(undefined);
  const [color, setColor] = React.useState(sortedColors[0]);

  // return form
  return (
    <form>
      {'highlight '}

      {/* for lower bound input */}
      <input type='number' width={5} placeholder='min' value={min} onChange={ (e) => {
        setMin(e.target.value);
        applyFormat(e.target.value, max, columnID, color, colorOptions[color].textcolor);
      }} />

      {' to '}

      {/* for upper bound input */}
        <input type='number' placeholder='max' value={max} onChange={ (e) => {
          setMax(e.target.value);
          applyFormat(min, e.target.value, columnID, color, colorOptions[color].textcolor) 
        }} />
      
      {/* for color selection */}
      <label>
        {'color: '}
        <select value={color} style={{backgroundColor: color, color: colorOptions[color].textcolor === 'white' ? 'white' : 'black'}} onChange={ (e) => { 
          setColor(e.target.value);
          applyFormat(min, max, columnID, e.target.value, colorOptions[e.target.value].textcolor);
        }}>
          {sortedColors.map(color => (
            <option value={color} style={{backgroundColor: color, color: 'black'}}>
              {colorOptions[color].label}
            </option>
          ))}
        </select>
      </label>

    </form>
  );
}