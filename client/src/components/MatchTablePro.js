import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import { Link } from 'react-router-dom';
import { dateFormat, countDaysSinceToday } from '../utils/dateFormat';
import MapImage from './MapImage';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
    backgroundColor: grey['300']
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class MatchTablePro extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
  const { classes } = this.props;
  const { rowsPerPage, page } = this.state;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.matches.length - page * rowsPerPage);
  const bannedAt = (addedAt, daysSinceLastBan) => {
    let difference = countDaysSinceToday(addedAt) - daysSinceLastBan;
    if (difference > 0) {
      difference *= -1;
      return `Someone banned ${difference} days after the match`;
    }
    difference *= -1;
    return `Someone banned ${difference} days before the match`;
  };

  const linkProps = (x) => {
    return {
      pathname: `/matches/${x.match_id}`,
      state: {
        matchID: x.match_id,
        team1: x.team1,
        team2: x.team2,
        addedAt: x.added_at,
        map: x.map_played,
        teamScore: x.team_score,
        opponentScore: x.opponent_score,
      },
    };
  };


  return (
    <Paper className={classes.root}>
    <div className={classes.tableWrapper} style={{backgroundColor: grey['400'] }}>
    <Typography variant="title">Matches</Typography>
      <Table className={classes.table}>
        <TableBody>
        <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Map</TableCell>
            <TableCell>Score</TableCell>
            <TableCell numeric>Bans</TableCell>
          </TableRow>
          {this.props.matches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(m => {
                return (
                  <TableRow key={m.match_id}>
                    <TableCell style={{ paddingRight: 0 }}>
                      <Link
                        to={linkProps(m)}
                        key={m.match_id}
                        href={`/matches/${m.match_id}`}
                        style={{color: 'black'}}
                      >
                        { dateFormat(m.added_at)}
                      </Link>
                    </TableCell>
                    <TableCell style={{ paddingRight: 0 }}>
                    <Link
                      to={linkProps(m)}
                      key={m.match_id}
                      href={`/matches/${m.match_id}`}
                    >
                      <img src={MapImage(m.map_played)} alt={m.map_played} />
                    </Link>
                    </TableCell>
                    <TableCell style={{ paddingRight: 0 }}>{m.team_score} - {m.opponent_score}</TableCell>
                    {m.bannedPlayers.length > 0 &&
                    <TableCell numeric>{ bannedAt(m.added_at, m.bannedPlayers[0].DaysSinceLastBan) }</TableCell> }
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
        </TableBody>
        <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={this.props.matches.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  Actions={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
      </div>
    </Paper>
  );
}
}

MatchTablePro.propTypes = {
  classes: PropTypes.object.isRequired,
  matches: PropTypes.array.isRequired,
};

export default withStyles(styles)(MatchTablePro);
