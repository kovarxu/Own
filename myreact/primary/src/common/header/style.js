import styled from 'styled-components'

export const S_Header = styled.div`
  padding: 10px 20px;
  line-height: 80px;
  background: #eee;
  .avatar {
    width: 80px;
    height: 80px;
    margin-right: 60px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .title {
    flex: 1;
    .con {
      /* width: fit-content; */
      /* margin: 0 auto; */
    }
    h2 {
      line-height: 40px;
    }
    h4 {
      font-weight: normal;
      text-indent: 2em;
      font-size: 12px;
      font-style: italic;
      line-height: 40px;
      &::before {
        content: '';
        display: inline-block;
        height: 1px;
        width: 4em;
        margin-right: 5px;
        vertical-align: middle;
        background: #999;
      }
    }
  }

  .links {
    li {
      display: inline-block;
      margin-left: 6px;
      margin-right: 6px;
      font-size: 12px;
    }
  }
`
