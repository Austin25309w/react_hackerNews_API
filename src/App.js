import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import loadings from './loading.svg'
import { sortBy } from 'lodash';

// const DEFAULT_QUERY = 'redux';
// const DEFAULT_HPP = '100';
// const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_SEARCH = '/search';
// const PARAM_SEARCH = 'query=';
// const PARAM_PAGE = 'page=';
// const PARAM_HPP ='hitsPerPage=';

import { 
    DEFAULT_QUERY,
    DEFAULT_HPP,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE,
    PARAM_HPP,
    url,
    } from './constants/index'



// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${PARAM_PAGE}`;
// console.log(url)






class App extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey:'',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
            sortKey: 'NONE'
        }
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.onSort = this.onSort.bind(this);
    }
    onSort(sortKey){
        this.setState({ sortKey })
    }
    
    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm]
    }

    

    setSearchTopStories(result){
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            results : {
                ...results,
                [searchKey]: {hits: updatedHits, page }
            },
            isLoading: false
        });

    }


    onSearchChange(e) {
        this.setState({
            searchTerm: e.target.value
        })
    }

    onDismiss(id){
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
    
        this.setState({
            results: { 
                ...results, 
                [searchKey] : {hits: updatedHits, page}
            }
        })
    }

    fetchSearchTopStories(searchTerm, page = 0 ){
        this.setState ({ isLoading: true });
        axios.get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            // .then(response => response.json())
            .then(result => this._isMounted && this.setSearchTopStories(result.data))
            .catch(error => this._isMounted && this.setState({error}));
    }

    componentDidMount(){
        this._isMounted = true;
        const{ searchTerm } = this.state;
        this.setState({ searchKey: searchTerm })
        this.fetchSearchTopStories(searchTerm)

        if(this.input) {
            this.input.focus();
        }

    }

    componentWillMount(){
        this._isMounted = false;
    }

    onSearchSubmit(e){
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm })

        if(this.needsToSearchTopStories(searchTerm)){
            this.fetchSearchTopStories(searchTerm);
        }
        e.preventDefault();
    }


    render(){
        const { searchTerm, results, searchKey, error, isLoading, sortKey } = this.state;
        const page = ( results && 
            results[searchKey] && 
            results[searchKey].page ) || 0;

        const list = ( results && 
            results[searchKey] && 
            results[searchKey].hits) || [];

        
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
                {error ? 
                <div className='interactions'> 
                    <h1 style ={{ color: 'red', textAlign:'center'}}>Something went wrong !! please fix(App>render)</h1>
                </div>
            
            : <Table 
                list = {list}
                sortKey = { sortKey}
                onSort = { this.onSort }
                onDismiss = {this.onDismiss}
            />
                }
            <div className = 'interactions'>
            {/* { isLoading
            ? <Loading />
            :
                <Button onClick ={() => this.fetchSearchTopStories(searchTerm, page+1)}>More</Button>
            } */}
            <ButtonWithLoading
                isLoading={isLoading}
                    onClick ={ () => this.fetchSearchTopStories(searchKey, page +1) }>
                    More
                    </ButtonWithLoading>
            </div>
        </div>
        )
    }
}

// END OF APP COMPONENT


// LODASH SORTING =====
const Sort = ({ sortKey, onSort, children}) =>
    <Button 
    onClick ={()=> onSort(sortKey)}
    className='button-inline'
    >
    {children}
    </Button>


const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list,'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'point').reverse(),
};

//=============================D

class Search extends Component {
    render() {
        const {
            value,
            onChange,
            children,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={onSubmit}>
                <input
                    value={value}
                    type='text'
                    onChange={onChange}
                    ref ={(node) => { this.input = node; }}
                />
                <button type='submit'>
                    {children}
                </button>
            </form>
        )
    }
}


class Table extends Component {
    constructor(props){
        super(props)
    }
    render() {

        const { list, sortKey, onSort, onDismiss } = this.props;
        const smallColumn = {
            width: '10%'
        }
        return (
            <div className='table'>
                <div className = 'table-header'>

                <span style = {{ width: '40%'}}>
                    <Sort 
                    sortKey = { 'TITLE' }
                    onSort = { onSort }
                    >
                    Title 
                    </Sort>
                </span>

                <span style = {{ width: '30%'}}>
                <Sort 
                    sortKey = {'AUTHOR'}
                    onSort = { onSort }
                    >
                    Author
                    </Sort>
                </span>

                <span style = {{ width: '10%' }}>
                <Sort 
                    sortKey = {'COMMENTS'}
                    onSort = { onSort }
                >
                Comments
                </Sort>                
                </span>

                <span style = {{ width: '10%' }}>
                <Sort 
                    sortKey = {'POINTS'}
                    onSort = { onSort }
                >
                Points
                </Sort>                
                </span>
            
                <span style = {{ width: '10%' }}>
                    Archive            
                </span>

                </div>
                {SORTS[sortKey](list).map(item =>
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

// BUTTON COMPONENT

const Button = ({onClick, className ='', children}) => {

    return (
        <button
            onClick={onClick}
            className= {className}
            type = 'button'
        >{children}</button>
        
    )
}

// HIGHER ORDER COMPONENT =======

const withLoading = ( Component ) => ({ isLoading, ...rest }) =>
    isLoading
    ? <Loading />
    :<Component { ...rest } />

const ButtonWithLoading = withLoading(Button);


const Loading = () => 
    <div><img src = { loadings } height='80'/></div>

// ===============================

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Button.defaultProps ={
    className : '',
}

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            url: PropTypes.string,
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
}

// const isSearched = searchTerm => item =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())

export {
    Button,
    Search,
    Table,
    Loading
}

export default App;
