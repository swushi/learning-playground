export default function Loggable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata('metakey', 'data', target);
    console.log(Reflect.getMetadata('metakey', target));
  };
}
