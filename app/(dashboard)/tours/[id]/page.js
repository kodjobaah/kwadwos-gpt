import TourInfo from '@/components/TourInfo';
import prisma from '@/lib/db';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

import { redirect } from 'next/navigation';
const SingleTourPage = async ({ params }) => {
    const tour = await prisma.tour.findUnique({
        where: {
            id: params.id,
        },
    });

    const { data } = await axios(`${url}${tour.city}`);
    const tourImage = data?.results[0]?.urls?.raw;

    // const tourImage = await generateTourImage({
    //     city: tour.city,
    //     country: tour.country,
    // });

    //   const tour = await getSingleTour(params.id);
    if (!tour) {
        redirect('/tours');
    }
    return (
        <div>
            <Link href='/tours' className='btn btn-secondary mb-12'>
                back to tours
            </Link>
            {tourImage ? (
                <div>
                    <Image
                        src={tourImage}
                        width={300}
                        height={300}
                        className='rounded-xl shadow-xl mb-16 h-96 w-96 object-cover'
                        alt={tour.title}
                        priority
                    />
                </div>
            ) : null}
            <TourInfo tour={tour} />
        </div>
    );
};
export default SingleTourPage;