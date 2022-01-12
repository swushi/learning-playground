export default function query() {
  let selectorFn: (() => null) | undefined = undefined;
  let _data: unknown[] = [];

  return {
    select: function (selector?: () => null) {
      if (selectorFn) {
        console.error("Already called select");
      }
      selectorFn = selector ?? (() => null);
      return this;
    },
    from: function(data: unknown[]) {
      _data = data;
      return this;
    },
    exec: function() {
      console.log(_data);
    }
  };
}

query().select().from([1,2,3]).exec()
