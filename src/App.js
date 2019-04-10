// Author      : Nisarg Patel
// Date        : 10th April 2019
// Description : Application that allows the user to search for a movie and display results
import React from "react";
import "./App.css";
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class App extends React.Component {
  constructor(){
    super() 
    this.getMoviesList = this.getMoviesList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
        isLoaded: false,
        favourites: [ ],
        items: []
      }
    this.getMoviesList();
  }
  componentDidMount(){
    document.title = "Movies"
  }
  // Function handles change of input value for title
  handleChange(e) {
    this.setState({ title: e.target.value })
  }
  // Function to add value to favourite list
  addToFav = value => e => {
     var newArray = this.state.favourites.slice();
     newArray.push(value);
     this.setState({favourites:newArray})
     return true;
  }
  // Function to remove value to favourite list
  removeFromFav = value => e => {
    var newArray = this.state.favourites;    
    var index = newArray.indexOf(value);
    delete newArray[index];
    this.setState({favourites:newArray})
    return true;
  }
  // Function to get movie list
  getMoviesList() {    
    if( typeof this.state.title === "undefined" )
       var searchText = "";
    else
       searchText = this.state.title;
    fetch(process.env.REACT_APP_API_URL+"/?apikey="+process.env.REACT_APP_API_KEY+"&s="+searchText)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("result=>", result);
          if(result.Response === "False"){
            this.setState({
              isLoaded: false,
              items: result.Search
            });
          }
          else{
            this.setState({
              isLoaded: true,
              items: result.Search
            });
          }          
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      )
  }

  render() {
    let tableDisplay;
    if(this.state.isLoaded){
      tableDisplay = <Paper className="MuiPaper-root-3 MuiPaper-elevation2-7 MuiPaper-rounded-4 SimpleTable-root-1">
          <Table className="MuiTable-root-30 SimpleTable-table-2">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell><TableCell>Favourite</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.items.map(row => (
                (this.state.favourites.indexOf(row.Title) > -1) ?
                '' :
                <TableRow key={row.id}>
                    <TableCell scope="row">
                      {row.Title}
                    </TableCell>
                    <TableCell scope="row"><Button variant="outlined" color="primary" onClick={this.addToFav(row.Title)}>Favourite</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table><br/>
        &nbsp;&nbsp;&nbsp;&nbsp;Favourites<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {(Number(this.state.favourites.length) === 0 ) ? "No Favourites Found." : ""}
          <Table className="MuiTable-root-30 SimpleTable-table-2">
            <TableBody>
              {this.state.items.map(row => (
                (this.state.favourites.indexOf(row.Title) > -1) ?
                <TableRow key={row.index}>
                    <TableCell scope="row">
                      {row.Title}
                    </TableCell>
                    <TableCell scope="row"><Button variant="outlined" color="secondary" onClick={this.removeFromFav(row.Title)}>Remove</Button></TableCell>
                </TableRow> : ''
              ))}
            </TableBody>
        </Table>
        </Paper>;
    } else {
      tableDisplay = <span>No Data Found.</span>;
    }

    return (
      <div className={"App"}>
        <div className={"InputWrapper"}>
          <input placeholder={"Enter a value..."} onChange={this.handleChange} autoFocus={true} />
          <Button onClick={this.getMoviesList}>Submit</Button>
        </div>
        <div><br/>
          Results:<br/><br/>
          {tableDisplay}
        </div>
      </div>
    );
  }
}

export default App;
