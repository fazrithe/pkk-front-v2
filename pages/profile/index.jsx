import { userService } from 'services';
import { Link } from 'components';
import { useState, useEffect } from 'react';

export default Profile;

function Profile() {
    const [profiles,setProfile] = useState();
    useEffect(() => {
        userService.getMe().then(x => setProfile(x.data.user));
    }, []);
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {profiles?.name}!</h1>
                <p>You&apos;re logged in with Next.js & JWT!!</p>
                <p><Link href="/users">Manage Users</Link></p>
            </div>
        </div>
    );
}
