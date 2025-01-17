import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/core-ui/navigation-menu'

export default function NavBar() {
  return (
    <div className="bg-background flex justify-between items-center p-4 border-b border-border">
      <div className="logo">
        <h4 className="text-2xl font-bold text-primary">Phoenix</h4>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
