"use client"

export default function guardOrganization(Component) {
  return function IsAuth(props) {
    return <Component {...props} />
  };
}