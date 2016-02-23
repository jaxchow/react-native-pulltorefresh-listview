
import React from 'react-native'
import ReboundScrollView from 'react-native-rebound-scrollview'
import ScrollListView from './ScrollListView'
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
let PullToRefreshListView= React.createClass({
  name: 'PullToRefreshListView',
  isRefreshing: false,
  propTypes:{
  	onRefresh: PropTypes.func,
  	onPull: PropTypes.func,
  	minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
      // props passed to child
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  	pullDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    pullingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
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
			onRefresh:function(){},
			onPull:function(){},
      minDisplayTime: 300,
			isRefreshing:false,
			isPulling:false,
      minBetweenTime: 300,
      minPulldownDistance: 60,
      scrollEventThrottle:32,
      refreshingIndictatorComponent: RefreshingIndicator,
      pullingIndictatorComponent: RefreshingIndicator,
      ignoreInertialScroll:false
    }
  },

	getInitialState() {
    return {
      isRefreshing: false,
			isPulling:false
    }
  },
  handleRefresh:function(cb){
		var self=this;
  	var loadingDataPromise = new Promise((resolve) => {
	  	self.isRefreshing=true
			self.setState({
					isRefreshing:true
			})
  	  var loadDataReturnValue = this.props.onRefresh(resolve)
  	  if (isPromise(loadDataReturnValue)) {
  		  loadingDataPromise = loadDataReturnValue
  	  }
  		Promise.all([
  			loadingDataPromise,
  			delay(this.props.minDisplayTime),
  		 ])
  		.then(() => delay(this.props.minBetweenTime))
  		.then(() => {
  		  self.isRefreshing= false
				self.setState({
					isRefreshing:false
				})
	//			console.log("refreshing end"+self.isRefreshing)
  		});
  	})
  },
  handlePull:function(){
		var self=this;
  	var loadingDataPromise = new Promise((resolve) => {
	  	self.isPulling=true
			self.setState({
					isPulling:true
			})
  	  var loadDataReturnValue = this.props.onPull(resolve)
  	  if (isPromise(loadDataReturnValue)) {
  		  loadingDataPromise = loadDataReturnValue
  	  }
  		Promise.all([
  			loadingDataPromise,
  			delay(this.props.minDisplayTime),
  		 ])
  		.then(() => delay(this.props.minBetweenTime))
  		.then(() => {
  		  self.isPulling= false
		//		console.log("pulling end"+self.isPulling)
				self.setState({
					isPulling:false
				})
  		});
  	})
  },

  //  this.props.onScroll && this.props.onScroll(e)
  render (){
		return(
			<ScrollListView
				{...this.props}
				ref={LISTVIEW_REF}
				isRefreshing={this.isRefreshing}
				handleRefresh={this.handleRefresh}
				isPulling={this.isPulling}
				handlePull={this.handlePull}
			/>
		)
  }
});


module.exports = PullToRefreshListView
