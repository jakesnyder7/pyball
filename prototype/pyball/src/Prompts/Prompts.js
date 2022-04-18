import './Prompts.css';

/**
 * Hook to define a component that displays a message and prompts the user to select 'Yes' or 'No' in response.
 * @author Claire Wagner
 * @param message The message to display.
 * @param onYes The function to call if the user selects 'Yes'.
 * @param onNo The function to call if the user selects 'No'.
 * @returns A div containing the component.
 */
export function YesNoPrompt({message, onYes, onNo}) {
  return (
    <div>
      <p className='bold'>
        {message}
      </p>
      <button id='yesButton' onClick={onYes}>
        {'Yes'}
      </button>
      {' '}
      <button id='noButton' onClick={onNo}>
        {'No'}
      </button>
    </div>
  )
}

/**
 * Hook to define a component that displays a message and asks for the user's acknowledgment.
 * @author Claire Wagner
 * @param message The message to display.
 * @param onAcknowledge The function to call when the user acknowledges the message. 
 * @returns A div containing the component.
 */
export function AcknowledgePrompt({message, onAcknowledge}) {
  return (
    <div>
      <p className='bold'>
        {message}
      </p>
      <button id='acknowledgeButton' onClick={onAcknowledge}>
        {'Ok'}
      </button>
    </div>
  )
}