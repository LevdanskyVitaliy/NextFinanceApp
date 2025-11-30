import Header from '../components/Header'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      < >
        <Header />
        <div className='no-scrollbar'>
       <main >{children}</main>
      
       </div>
      
    </>
  )
}