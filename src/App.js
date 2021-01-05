import React, { Component } from 'react';
import './App.css';
import Button from './components/Button';
import Search from './components/Search';
import Table from './components/Table';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from './constants';


class App extends Component {
  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.results.hits.filter(isNotId);
    this.setState({ 
      results: { ...this.state.results, hits: updatedHits }, 
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page} = result;

    this.setState(prevState => {
      const { results } = prevState;

      const oldHits = page !== 0 
      ? results.hits
      : [];

      const updatedHits = [
        ...oldHits,
        ...hits
      ]

      return { 
        results: { hits: updatedHits, page },
        isLoading: false, 
      };
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this._isMounted && this.setSearchTopStories(result))
      .catch(error => this._isMounted && this.setState({ error}));
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();    
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  
  render() {
    const { 
      searchTerm, 
      results, 
      error, 
      isLoading } = this.state;

    const page = (results && results.page ) || 0;
    let list = [];

    if(results){
      list = results.hits;
    }

    return (
      <div className="page">
        <div className="interactions">
        <h1>Hackernews</h1>
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {
          error 
          ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>
          : <Table
              list={list}
              onDismiss={this.onDismiss}
            />
        }
        <div className="interactions">
          {
            isLoading
            ? <Loading />
            : <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1 )}>
                More
              </Button>
          }
        </div>
      </div>
    );
  }
}

const Loading = () =>
  <div>Loading ...</div>
   
export default App;
