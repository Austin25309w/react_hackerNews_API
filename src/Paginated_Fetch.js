import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP ='hitsPerPage='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${PARAM_PAGE}`;
console.log(url)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        }
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    }

    

    setSearchTopStories(result){
        const { hits, page } = result;

        const oldHits = page !== 0
        ? this.state.result.hits
        : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            result : {hits: updatedHits, page}
        });

    }

    onSearchChange(e) {
        this.setState({
            searchTerm: e.target.value
        })
    }

    onDismiss(id){
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
    
        this.setState({
            result: {...this.state.result, hits: updatedHits}
        })
    }

    fetchSearchTopStories(searchTerm, page = 0 ){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    componentDidMount(){
        const{ searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm)

    }

    onSearchSubmit(e){
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        e.preventDefault();
    }
    render(){
        const { searchTerm, result } = this.state;
        const page = ( result && result.page ) || 0;
        if(!result) {return null; }
        return (
        <div className = 'page'>
            <div className = 'interactions'>
                <Search
                    value = {searchTerm}
                    onChange = {this.onSearchChange}
                    onSubmit = {this.onSearchSubmit}
                    >Search
                    </Search>
                </div>
            {result &&
            <Table 
                list = {result.hits}
                onDismiss = {this.onDismiss}
            />
            }
            <div className = 'interactions'>
                <Button onClick ={() => this.fetchSearchTopStories(searchTerm, page+1)}>More</Button>
            </div>
        </div>
        )
    }
}

const Search = ({ value, onChange, children, onSubmit }) =>
    <form onSubmit = {onSubmit}>
        <input
        value = {value}
        type = 'text'
        onChange = {onChange}
        />
        <button type='submit'> 
        {children}
        </button>
    </form>

class Table extends Component {
    render() {

        const { list, pattern, onDismiss } = this.props;

        const smallColumn = {
            width: '10%'
        }
        return (
            <div className='table'>
                {list.map(item =>
                    <div key={item.objectID} className='table-row'>
                        <span style = {{width: '40%'}}>
                            <a href={item.url}> {item.title}</a>{' | '}
                        </span>
                        <span style = {{width: '30%'}}>ID:{item.objectID}</span>{' | '}
                        <span style = {smallColumn}>Comments:{item.num_comments}</span>{' | '}
                        <span style = {smallColumn}>Points {item.points}</span>
                        <span style = {smallColumn}>
                            <Button className='button-inline' onClick={() => onDismiss(item.objectID)}>
                                Dismiss
                            </Button>
                        </span>
                    </div>
             )}
            </div>
        )
    }
}

const Button = ({onClick, className ='', children}) => {

    return (
        <button
            onClick={onClick}
            className= {className}
            type = 'button'
        >{children}</button>
    )
}

// const isSearched = searchTerm => item =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())

export default App;
