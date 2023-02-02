import { userService } from 'services';
import { Link } from 'components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { alertService } from 'services';

export default Profile;

function Profile() {
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [preview, setPreview] = useState("");
    const router = useRouter();
    const [profiles,setProfile] = useState();
    
    useEffect(() => {
        const data = userService.getMe()
        .then(x => (setProfile(x.data.user),setName(x.data.user.name)));
    }, []);
    console.log(profiles);
    const loadImage = (e) => {
        const image = e.target.files[0];
        setPhoto(image);
        setPreview(URL.createObjectURL(image));
    }

    const updateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const userId = profiles?.id
        formData.append('photo', photo);
        formData.append('name', name);
        return userService.updateProfile(userId, formData, 'users')
            .then((response) => {
                if(response.status != "fail" ){
                    alertService.success('User updated', { keepAfterRouteChange: true });
                    router.push('/profile');
                }else{
                    alertService.error(response.message, { keepAfterRouteChange: true });
                    router.push(`/profile`);
                }
            })
            .catch(alertService.error);
    }
    return (
        <div className="p-4">
            <div className="container">
                <div className='row'>
                    <div className='col-6'>
                        <div className='row'>
                            <div className='col-4'>
                                <h1>Hi {profiles?.name}!</h1>
                            </div>
                            <div className='col-4'>
                            {profiles?.photo_path ? (
                                <figure className="image is-128x128">
                                <img src={profiles?.photo_path} alt="Preview Image" width="200px" className='img-fluid img-thumbnail' />
                                </figure>
                            ) : (
                                ""
                            )}
                            </div>
                        </div>
                        <form onSubmit={updateProfile}>
                            <div className='form-group'>
                                <label>Name</label>
                                <input type="text" name='name' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>Email</label>
                                <input type="text" name='email' className='form-control' value={profiles?.email} readOnly />
                            </div>
                            <div className='form-group'>
                                <label>Photo</label>
                                <input type="file" name='photo' className='form-control' onChange={loadImage}/>
                            </div>
                            <div className='form-group'>
                                <div className='rows'>
                                <div className='col-3'>
                            {preview ? (
                                <figure className="image is-128x128">
                                <img src={preview} alt="Preview Image" width="200px" />
                                </figure>
                            ) : (
                                ""
                            )}
                            </div>
                            </div>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary'>Update</button>    
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
