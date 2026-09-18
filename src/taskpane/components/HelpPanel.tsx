import * as React from "react";
import Help from './Help.mdx';

const HelpPanel: React.FC = () => {
  return (
    <section role="tabpanel" aria-labelledby="help-panel-label">
      <Help />
    </section>
  )
}

export default HelpPanel
