import React from "react";

export default function useLoading(
  init = false
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [loading, setLoading] = React.useState(init);

  return [loading, setLoading];
}
