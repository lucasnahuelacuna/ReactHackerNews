import React, { Component } from 'react';
import Button from '../../components/Button';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class Table extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
    }

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    this.setState({ sortKey });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey } = this.state;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%'}}>
            <Sort 
              sortKey={'TITLE'}
              onSort={this.onSort}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: '30%'}}>
            <Sort 
              sortKey={'AUTHOR'}
              onSort={this.onSort}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '10%'}}>
            <Sort 
              sortKey={'COMMENTS'}
              onSort={this.onSort}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%'}}>
            <Sort 
              sortKey={'POINTS'}
              onSort={this.onSort}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%'}}>
            Archive
          </span>
        </div>
      {SORTS[sortKey](list).map(item => 
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%'}}>
              {item.author}
            </span>
            <span style={{ width: '10%'}}>
              {item.num_comments}
            </span>
            <span style={{ width: '10%'}}>
              {item.points}
            </span>
            <span style={{ width: '10%'}}>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"  
              >
                Dismiss
              </Button>
            </span>
          </div>
      )}
  </div>
    );
  }
}

Table.propTypes = {
    list: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
}

const Sort = ({ sortKey, onSort, children }) => 
  <Button 
    onClick={() => onSort(sortKey)}
    className="button-inline"
  >
    {children}
  </Button>

export default Table;