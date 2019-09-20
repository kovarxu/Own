import React, { userState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getBlogList } from './action'
import BodyContainer from '../../common/body_container'
import Header from '../../common/header'
import List from './component/list'

function Blog (props) {
  useEffect(() => {
    // can not use getBlogList() directly, for its an action, you should dispatch it.
    props.dispatch(getBlogList())
  }, [])

  return (
    <div>
      <Header />
      <BodyContainer>
        <List blogs={props.blogs} />
      </BodyContainer>
    </div>
  )
}

const mapStateToProps = state => ({
  loading: state.blog.loading,
  error: state.blog.error,
  blogs: state.blog.blogs
})

export default connect(mapStateToProps)(Blog)
