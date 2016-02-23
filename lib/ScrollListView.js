
import React from 'react-native'
import ReboundScrollView from 'react-native-rebound-scrollview'

var isPromise = require('is-promise')
var delay = require('./delay')
var RefreshingIndicator = require('./RefreshingIndicator')

let {
	Component,
	ListView,
	PropTypes,
	cloneElement,
	createElement,
	isValidElement
}=React
function createElementFrom(elementOrClass, props) {
  if (isValidElement(elementOrClass)) {
    return cloneElement(elementOrClass, props)
  } else { // is a component class, not an element
    return createElement(elementOrClass, props)
  }
}

const LISTVIEW_REF = 'listview'

//class PullToRefreshListView extends Component{
//
let ScrollListView= React.createClass({
  name: 'ScrollListView',
  isRefreshing: false,
  propTypes:{
  	handleRefresh: PropTypes.func.isRequired,
  	handlePull: PropTypes.func.isRequired,
      // props passed to child
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  	pullDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    pullingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  	ignoreInertialScroll: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
  	onScroll: PropTypes.func,
  	renderHeader: PropTypes.func,
    renderHeaderWrapper: PropTypes.func,
  	renderFooter: PropTypes.func,
    renderFooterWrapper: PropTypes.func,
  	onResponderGrant: PropTypes.func,
    onResponderRelease: PropTypes.func,
  },
  getDefaultProps() {
    return {
      minPulldownDistance: 40,
      scrollEventThrottle:32,
      refreshingIndictatorComponent: RefreshingIndicator,
      pullingIndictatorComponent: RefreshingIndicator,
      ignoreInertialScroll:false
    }
  },
	getInitialState() {
    return {
      isRefreshing: false,
    }
  },
  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  },
  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  },
  handleScroll(e) {
	var nativeEvent=e.nativeEvent;
    var scrollY = nativeEvent.contentInset.top + nativeEvent.contentOffset.y
    if (this.isTouching || (!this.isTouching && !this.props.ignoreInertialScroll)) {
      if (scrollY < -this.props.minPulldownDistance) {
        if (!this.props.isRefreshing) {
          if (this.props.handleRefresh) {
				    this.props.handleRefresh()
						return
          }
        }
      }
  	  if(scrollY>0 &&(nativeEvent.contentSize.height-nativeEvent.contentOffset.y+this.props.minPulldownDistance<nativeEvent.layoutMeasurement.height)){
  			if (!this.props.isPulling) {
  			  if (this.props.handlePull) {
  					this.props.handlePull()
						return
  			  }
  			}
  	  }
    }
  //  this.props.onScroll && this.props.onScroll(e)
  },
  handleResponderGrant() {
    this.isTouching = true
    if (this.props.onResponderGrant) {
      this.props.onResponderGrant.apply(null, arguments)
    }
  },
  handleResponderRelease() {
    this.isTouching = false
    if (this.props.onResponderRelease) {
      this.props.onResponderRelease.apply(null, arguments)
    }
  },
  renderHeader() {
    var description = this.props.refreshDescription
    var refreshingIndictator
    if (this.props.isRefreshing) {
      refreshingIndictator = createElementFrom(this.props.refreshingIndictatorComponent, {description})
    } else {
      refreshingIndictator = null
    }
    if (this.props.renderHeaderWrapper) {
      return this.props.renderHeaderWrapper(refreshingIndictator)
    } else if (this.props.renderHeader) {
      console.warn('renderHeader is deprecated. Use renderHeaderWrapper instead.')
      return this.props.renderHeader(refreshingIndictator)
    } else {
      return refreshingIndictator
    }
  },
  renderFooter() {
    var description = this.props.refreshDescription

    var refreshingIndictator
    if (this.props.isPulling) {
      refreshingIndictator = createElementFrom(this.props.pullingIndictatorComponent, {description})
    } else {
      refreshingIndictator = null
    }
    if (this.props.renderFooterWrapper) {
      return this.props.renderFooterWrapper(refreshingIndictator)
    } else if (this.props.renderFooter) {
      console.warn('renderHeader is deprecated. Use renderHeaderWrapper instead.')
      return this.props.renderFooter(refreshingIndictator)
    } else {
      return refreshingIndictator
    }
  },
  render (){
	return(
		<ListView
			{...this.props}
			ref={this.props.ref}
			renderScrollComponent={props =><ReboundScrollView {...props} />}
			renderHeader={this.renderHeader}
			renderFooter={this.renderFooter}
			scrollEventThrottle={this.props.scrollEventThrottle}
			onResponderGrant={this.handleResponderGrant}
			onResponderRelease={this.handleResponderRelease}
			onScroll={this.handleScroll}
		/>
	)
  }
});


module.exports = ScrollListView
