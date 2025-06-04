import Footer from '@components/layout/Footer'
import Header from '@components/layout/Header'
import MainLayout from '@components/layout/MainLayout'
import Banner from '@components/ui/Banner'
import ProductItem from '@components/ui/ProductItem'

function HomePage() {
    return (
        <div>
            <Header />
            <MainLayout>
                <Banner />
                <ProductItem />
            </MainLayout>
            <Footer />
        </div>
    )
}

export default HomePage
