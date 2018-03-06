// Import the `Value` model.
import React from 'react'
import { Editor } from 'slate-react'
import { Block, Value } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'
import styled from 'styled-components'

import data from './schema.json'

function SentenceNode(props) {
  return <Sentence {...props.attributes} onClick={() => console.log(props)}>{props.children}</Sentence>
}
// Create our initial value...
const initialValue = Value.fromJSON(data)

const schema = {
  document: {
    nodes: [
      { types: ['sentence'], min: 2, max: 2 },
    ],
    normalize: (change, violation, { node, child, index }) => {
      switch (violation) {
        case CHILD_REQUIRED: {
          const block = Block.create('sentence')
          return change.insertNodeByKey(node.key, index, block)
        }
      }
    },
  },
}



// Define our app...
class App extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue,
  }

  // On change, update the app's React state with the new editor value.
  onChange = (change) => {
    const { value } = change
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    const { value } = change
    if (event.key != 'Enter') return
    return change.insertText('\n')
  }
  renderNode = props => {
    switch (props.node.type) {
      case 'sentence':
        return <SentenceNode {...props} />
    }
  }

  // Render the editor.
  render() {
    return <Editor
      ref={el => { this.slate = el }}
      value={this.state.value}
      onChange={this.onChange}
      onKeyDown={this.onKeyDown}
      renderNode={this.renderNode}
      schema={schema}
    />
  }
}


const Sentence = styled.div`
  display: inline;
  background-color: red;
`
export default App;
