import '../assets/styles/footer.styl'

export default {
  data () {
    return {
      author: 'Kovar'
    }
  },
  render () {
    return (
      <div id="main-footer">
        <span>Written By {this.author}</span>
      </div>
    )
  }
}