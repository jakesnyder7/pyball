import { tab } from '@testing-library/user-event/dist/tab';
import React from 'react';
import './Tabs.css'

/**
 * Hook to define a tab.
 * @author Claire Wagner
 * @param label The label to display on the tab.
 * @param children The components to display when the tab is active.
 * @param activeTabLabel Whether or not the tab is currently active.
 * @param onClick The event handler for the tab.
 * @returns The tab as a list item.
 * Portions of this hook are based on https://www.digitalocean.com/community/tutorials/react-tabs-component (CC BY-NC-SA 4.0 license). 
 */
function Tab({label, children, activeTabLabel, onClick}) {
  let className = 'tabListItem' + ((activeTabLabel === label) ? ' activeTab' : '');
  return (
    <li className={className} onClick={() => onClick(label, children)}>
      {label}
    </li>
  );
}

/**
 * Hook to define a group of tabs.
 * @author Claire Wagner
 * @param tabs The tabs to display (must include a property called 'label' specifying the label to display
 * on the tab and a property called 'children' defining the components that should be displayed when
 * the tab is active).
 * @returns A div containing the group of tabs.
 * Portions of this hook are based on https://www.digitalocean.com/community/tutorials/react-tabs-component (CC BY-NC-SA 4.0 license). 
 */
export function Tabs({tabs}) {
  const [activeTabLabel, setActiveTabLabel] = React.useState(tabs[0].label);
  const [activeTabChildren, setActiveTabChildren] = React.useState(tabs[0].children);

  function onClick(label, children) {
    setActiveTabChildren(children);
    setActiveTabLabel(label);
  }
  return (
    <div>
      <ol className='tabList'>
        {tabs.map((tab) => {
          return(
            <Tab key={tab.label} label={tab.label} children={tab.children} activeTabLabel={activeTabLabel} onClick={onClick} />
          )
        })}
      </ol>
      <div>
        {tabs.map((tab) => {
          return (
            activeTabLabel === tab.label ?
            tab.children
            : ''
          )
        })} 
      </div>
    </div>
  );
}