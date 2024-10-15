import dynamic from 'next/dynamic';
import Loading from './loading';

const FormComponent = dynamic(() => import('@/components/form/form'), { ssr: false, loading: () => <Loading /> });

export default function Home() {
    return (
        <div>
            <FormComponent />
        </div>
    );
}
