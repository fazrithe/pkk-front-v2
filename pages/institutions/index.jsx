import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService } from 'services';
import { allService } from 'services/all.service';
import { alertService } from 'services';

export default Index;

function Index() {
    const [institutions, setInstitutions] = useState(null);

    useEffect(() => {
        allService.getAll('institutions').then(x => setInstitutions(x.data));
    }, []);

    function deleteInstitution(ID) {
        setInstitutions(institutions.map(x => {
            if (x.ID === ID) { x.isDeleting = true; }
            return x;
        }));
        allService.delete(ID,'institutions').then(() => {
            setInstitutions(institutions => institutions.filter(x => x.ID !== ID));
            alertService.success('User deleted', { keepAfterRouteChange: true });
        });
    }

    return (
        <Layout>
            <h1>Institution</h1>
            <Link href="/institutions/add" className="btn btn-sm btn-success mb-2">Add Institusion</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Name</th>
                        <th style={{ width: '30%' }}>Addresss</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {institutions && institutions.map(institusion =>
                        <tr key={institusion.ID}>
                            <td>{institusion.name}</td>
                            <td>{institusion.address}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/institutions/edit/${institusion.ID}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteInstitution(institusion.ID)} className="btn btn-sm btn-danger btn-delete-user" disabled={institusion.isDeleting}>
                                    {institusion.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!institutions &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {institutions && !institutions.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
