import React from 'react'
import { withAuth } from 'features/login'
// import { Link } from 'react-router-dom'
import { Login } from 'features/auth'

const HomePage = () => (
    <div>
        Crossroad!
    </div>
)

const HomePagePublic = () => (
    <Login />
)

export default withAuth({ fallback: HomePagePublic })(HomePage)
