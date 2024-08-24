'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Copy from './Copy'
import { useContext, useEffect, useState } from 'react'
import { ProviderContext } from '@/Functions/Contexts'
import { connectToWalet } from '@/Functions/BlockchainFunctions'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'


function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

  const { isConnected, provider, setProvider, setIsConnected } = useContext(ProviderContext)
  const [account, setAccount] = useState<string>("")
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', current: false },
    { name: 'Explore', href: '/explore', current: false },
    { name: 'Create', href: '/add', current: false },
  ])
  const router = useRouter()

  const pathName = usePathname()
  const loadAccount = async () => {
    let tempSigner = await provider?.getSigner();
    const tempAccount = await tempSigner?.getAddress()
    if (tempAccount) {

      setAccount(tempAccount)
    }
  }
  const setCurrentNavbarOption = (updatedPath: string) => {
    let tempNav = navigation;
    for (let x = 0; x < tempNav.length; x++) {
      console.log(updatedPath, tempNav[x].href)
      if (updatedPath === tempNav[x].href) {
        tempNav[x].current = true;
      } else {
        tempNav[x].current = false;
      }
    }

    console.log(tempNav)
    setNavigation([...tempNav])

  }
  const handleClick = async () => {
    if (isConnected === false) {
      connectToWalet(window, setProvider, setIsConnected, setAccount)
    }
  }


  useEffect(() => {
    loadAccount()
  }, [isConnected])

  useEffect(() => {
    console.log("changed")
    setCurrentNavbarOption(pathName)
  }, [pathName])

  useEffect(() => {
    loadAccount()
    setCurrentNavbarOption("/")
 
  }, [])
  return (
    <Disclosure as="nav" className="bg-white w-screen">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1  items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/" className="flex invisible md:visible flex-shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/img/logos/mark.svg?color=cyan&shade=700"
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation && navigation.map((item) => (
                  <>
                    {item.current ?
                      <Link
                        key={item.name}
                        href={item.href}
                        className={" rounded-md px-3 py-2 text-sm font-medium bg-gray-200 text-gray-400"}
                      >
                        {item.name}
                      </Link>
                      :
                      <Link
                        key={item.name}
                        href={item.href}
                        className={" rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white"}
                      >
                        {item.name}
                      </Link>
                    }
                  </>

                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button> */}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton onClick={handleClick} className="relative opacity-100 text-gray-500 active:shadow-gray-500 hover:opacity-75 flex rounded-lg bg-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ">
                  <span className="absolute -inset-1.5" />
                  {isConnected ? <Copy text={account} length={8} icon={false} /> : "Connect"}
                </MenuButton>
              </div>
              {/* <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems> */}
            </Menu>
          </div>
        </div>
        {!account && <div className='flex justify-center w-full text-xs text-red-500 bg-white py-1 rounded-md'>
          Your wallet isnt connected, this could prevent  in-app features
        </div>}
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              onClick={()=>{router.push(item.href)}}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium text-gray-400',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
