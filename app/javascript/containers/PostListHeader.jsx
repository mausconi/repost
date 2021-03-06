import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Popover, PopoverTitle, PopoverContent, UncontrolledTooltip } from 'reactstrap'
import Icon from 'react-fontawesome'
import CSSModules from 'react-css-modules'
import classNames from 'classnames'
import * as channelActions from '../actions/channelActions'
import ChannelForm from '../components/ChannelForm'
import styles from '../styles/PostListHeader.scss'
import endpoints from '../config/endpoints'

class PostListHeader extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    if (this.props.channel.name == 'All') {
      return
    }
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleClick() {
    if (window.confirm('Are you sure?')) {
      this.props.deleteChannel(endpoints.channel(this.props.channel.id))
    }
  }

  handleSubmit(values) {
    this.props.updateChannel(endpoints.channel(this.props.channel.id), values)
  }

  render() {
    const { channel, currentUser, users } = this.props
    const editable = (!['All', 'Starred'].includes(channel.name)) && (currentUser.role == 'admin')

    if (!channel.name) {
      return <div styleName="container" />
    }

    return (
      <div id="post_list_header" styleName="container">
        <span id="edit_channel" onClick={this.toggle} styleName={classNames('channel', { editable: editable })}><Icon name={channel.icon} /> {channel.name}</span>
        {editable ? (
          <UncontrolledTooltip placement="bottom" target="edit_channel">
            Edit channel
          </UncontrolledTooltip>
        ) : null}
        {editable ? (
          <Popover target="edit_channel" placement="bottom" isOpen={this.state.isOpen} toggle={this.toggle}>
            <PopoverTitle>Edit channel</PopoverTitle>
            <PopoverContent>
              <ChannelForm
                label="Edit"
                initialValues={channel}
                onSubmit={this.handleSubmit} />
              <div styleName="delete">
                or <a id="delete_channel" onClick={this.handleClick}>Delete this channel</a>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
        <div styleName="right">
          {(users.length > 0) ? (
            <span><Icon name="user" /> {users.length}</span>
          ) : null}
        </div>
      </div>
    )
  }
}

PostListHeader.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  currentUser: PropTypes.shape({
    role: PropTypes.oneOf(['member', 'admin']).isRequired
  }).isRequired,
  users: PropTypes.array.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    channel: state.channel,
    currentUser: state.currentUser,
    users: state.users
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(channelActions, dispatch)
}

PostListHeader = CSSModules(PostListHeader, styles, { allowMultiple: true })

export default connect(mapStateToProps, mapDispatchToProps)(PostListHeader)
