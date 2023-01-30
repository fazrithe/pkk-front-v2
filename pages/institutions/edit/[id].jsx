import { useState, useEffect } from 'react';

import { Layout, AddEdit } from 'components/institutions';
import { Spinner } from 'components';
import { userService, alertService } from 'services';
import { allService } from 'services/all.service';

export default Edit;

function Edit({ id }) {

    const [institution, setInstitutions] = useState(null);

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        allService.getById(id,'institutions')
            .then(x => setInstitutions(x.data))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Layout>
            <h1>Edit Institution</h1>
            {institution ? <AddEdit institution={institution} /> : <Spinner /> }
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id }
    }
}
