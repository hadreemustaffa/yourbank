type Icon = {
  SvgIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isBorderless?: boolean;
  width?: number;
  height?: number;
};

function Icon({ SvgIcon, isBorderless, width = 24, height = 24 }: Icon) {
  return (
    <span
      className={`flex rounded-md ${isBorderless ? "" : "border border-accent/10 p-2"}`}
    >
      <SvgIcon width={width} height={height} />
    </span>
  );
}

export default Icon;
