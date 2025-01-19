import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/core-ui/navigation-menu'
import Link from 'next/link'

export default function NavBar() {
  return (
    <div className="bg-background flex justify-between items-center p-4 border-b border-border">
      <Link href="/">
        <h4 className="text-2xl font-bold text-primary">Phoenix Growth</h4>
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          {/* <NavigationMenuItem>
            <p className="">Client Insights</p>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
