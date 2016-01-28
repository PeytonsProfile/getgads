<head>
    <meta charset="utf-8" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.5/react.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.5/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
    <link rel='stylesheet' href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css" />
  </head>
  <body>
    <div id='content' class='container'></div>
    <script type="text/babel">
      class List extends React.Component{
        constructor(props){
          super(props);
          this.state = { items: [], complete: 0, nextID: 0};
          this.items = this.items.bind(this);
          this.addItem = this.addItem.bind(this);
          this.completeCount = this.completeCount.bind(this);
          this.refreshCount = this.refreshCount.bind(this);
          this.deleteItem = this.deleteItem.bind(this);
        }
        completeCount(){
          let complete = this.state.complete;
          return(<p>{`${complete}/${this.state.items.length} complete`}</p>);
        }
        refreshCount(id, checked){
          let itemArray = this.state.items;
          let index = itemArray.findIndex( x => x.id === id);
          let item = itemArray.splice(index, 1)[0];
          item.complete = checked;
          let complete = this.state.complete;
          if (checked){
            itemArray.push(item);
            complete++;
          } else {
            itemArray.unshift(item);
            complete--;
          }
          this.setState({complete: complete, items: itemArray});
        }
        deleteItem(id){
          let itemArray = this.state.items;
          let index = itemArray.findIndex( x => x.id === id);
          let checked = itemArray[index].complete;
          let complete = checked ? (this.state.complete - 1) : this.state.complete;
          itemArray.splice(index, 1);
          this.setState({ items: itemArray, complete: complete, nextID: this.nextID(this.state.nextID) });
        }
        items(){
          let items = [];
          this.state.items.map( item => {
            items.push(<Item key={`item-${item.id}`} {...item} deleteItem={this.deleteItem} refreshCount={this.refreshCount} />);
          })
          return items;
        }
        nextID(id){
          return id += 1;
        }
        addItem(e){
          e.preventDefault();
          let items = this.state.items;
          items.unshift({ name: this.refs.name.value, complete: false, id: this.state.nextID });
          this.refs.name.value = null;
          this.setState({ items: items, nextID: this.nextID(this.state.nextID) });
        }
        render(){
          return(
            <div className='center'>
              <h1> To Do </h1>
              <form onSubmit={this.addItem}>
                <input placeholder='add item' type='text' ref='name' />
              </form>
              {this.completeCount()}
              <hr />
              <div className='row'>
                {this.items()}
              </div>
            </div>
          );
        }
      }

      class Item extends React.Component{
        constructor(props){
          super(props);
          this.state = { checked: false, style: {} };
          this.toggleChecked = this.toggleChecked.bind(this);
        }
        toggleChecked(){
          let complete = !this.state.checked;
          let style = {};
          if (complete) {
            style = {
              textDecoration: 'line-through',
              color: 'grey'
            }
          }
          this.setState({ checked: complete, style: style });
          this.props.refreshCount(this.props.id, complete);
        }
        render(){
          let id = `complete-${this.props.id}`;
          let color = this.state.checked ? 'green lighten-5' : 'grey lighten-5';
          return(
            <div className={`${color} col s12`}>
              <div className='col m8' style={this.state.style}>
                {this.props.name}
              </div>
              <div className='col m3'>
                <input onChange={this.toggleChecked} type='checkbox' id={id} defaultChecked={this.props.checked} />
                <label htmlFor={id}>Complete</label>
              </div>
              <div onClick={() => this.props.deleteItem(this.props.id)} className='col m1'>
                X
              </div>
            </div>
          )
        }
      }

      ReactDOM.render(<List />, document.getElementById('content'));
    </script>
  </body>
</html>
