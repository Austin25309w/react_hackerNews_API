import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor() {
        super()
        this.state = {
            searchTerm: '',
            list: [
                {
                    title: 'React',
                    url: 'https://facebook.github.io/react/',
                    author: 'Jordan Walke',
                    num_comments: 3,
                    points: 4,
                    objectID: 0,
                },
                {
                    title: 'Redux',
                    url: 'https://facebook.github.io/reactjs/redux',
                    author: 'Dan Abramov, Andrew Clark',
                    num_comments: 2,
                    points: 5,
                    objectID: 1,
                },
                {
                    title: 'Angular',
                    url: 'https://facebook.github.io/reactjs/redux',
                    author: 'Dan Abramov, Andrew Clark',
                    num_comments: 2,
                    points: 5,
                    objectID: 2,
                },
                {
                    title: 'Vue',
                    url: 'https://facebook.github.io/reactjs/redux',
                    author: 'Dan Abramov, Andrew Clark',
                    num_comments: 2,
                    points: 5,
                    objectID: 3,
                },
                {
                    title: 'Vanilla Javascript',
                    url: 'https://facebook.github.io/reactjs/redux',
                    author: 'Dan Abramov, Andrew Clark',
                    num_comments: 2,
                    points: 5,
                    objectID: 4,
                },


            ]
        }
    }

    onDismiss = (id) => {
        const isNotId = item => item.objectID !== id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({ list: updatedList })
    }
    onSearchChange = (e) => {
        this.setState({
            searchTerm: e.target.value
        })
    }
    render() {
        const { searchTerm, list } = this.state
        return <div className='page'>
            <div className='interactions '>
            <Search
                value={searchTerm}
                onChange={this.onSearchChange}
            > Search
            </Search>
            </div>
            <Table
                list={list}
                pattern={searchTerm}
                onDismiss={this.onDismiss}
            />
        </div>;
    }
}

// class Search extends Component {
//     render() {
//         const { value, onChange, children } = this.props;
//         return (
//             <form>
//                 {children} <input
//                     type="text"
//                     value={value}
//                     onChange={onChange}
//                 />
//             </form>
//         )
//     }
// }
const Search = ( {value, onChange, children}) =>
    <form>
        {children}<input
            type ="text"
            value = {value}
            onChange = {onChange}
            />
    </form>

// class Button extends Component {

//     render() {
//         const {
//             onClick,
//             className = '',
//             children,
//         } = this.props;
//         return (
//             <button
//                 onClick={onClick}
//                 className={className}
//                 type='button'
//             >{children}
//             </button>
//         )
//     }
// }

const Button = ({onClick, className ='', children}) => {

    return (
        <button
            onClick={onClick}
            className= {className}
            type = 'button'
        >{children}</button>
    )
}


class Table extends Component {
    render() {

        const { list, pattern, onDismiss } = this.props;

        const smallColumn = {
            width: '10%'
        }
        return (
            <div className='table'>
                {list.filter(isSearched(pattern)).map(item =>
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

// es5
function isSearched(searchTerm) {
    return function(item){
        return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    }
}

//es6
// const isSearched = searchTerm => item => 
//     item.title.toLowerCase().includes(searchTerm.toLowerCase());




export default App;
