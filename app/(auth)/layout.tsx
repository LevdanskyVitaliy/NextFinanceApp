import Header from '../components/Header'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      < >
        <Header />
        <div className=' mt-20'>
       <main >{children}</main>
       </div>
      
    </>
  )
}
