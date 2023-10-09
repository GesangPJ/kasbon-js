import Link from 'next/link'

const ErrorPage = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode} - An error occurred</h1>
      <Link href="/">
        <a>Return to the homepage</a>
      </Link>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return { statusCode }
}

export default ErrorPage
