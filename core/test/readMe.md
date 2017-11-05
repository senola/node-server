### mocha should

mocha 用法

```javascript
describe("utils", function(){  // 分组 可以用，utils、api等
    describe("#random-int",function() { // 共功能名称
        it('返回随机浮点数', function() {
            should(11).be.exactly(11);
        });

   })
});

```

should 用法

```javascript
(true).should.be.true();
(true).should.not.be.false();
false.should.be.false();

(true).should.be.ok();
should(null).not.be.ok();
(10).should.be.ok();

[ 1, 2, 3].should.containDeep([2, 1]);
[ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);

包含
[1, 2, 3].should.containEql(1);
[{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
'abc'.should.containEql('b');
'ab1c'.should.containEql(1);

'ab'.should.be.equalOneOf('a', 10, 'ab');
({a: 10}).should.be.oneOf(['a', 10, 'ab', {a: 10}]);

等于
(10).should.be.eql(10);
('10').should.not.be.eql(10);

全等于 ===
10.should.be.equal(10);

异常
(function(){ throw new Error('fail') }).should.throw();
(function(){ throw new Error('fail') }).should.throw('fail');

match
'foobar'.should.match(/^foo/);
'foobar'.should.not.match(/^bar/);
(5).should.not.match(function(n) {
  return n < 0;
});
[ 'a', 'b', 'c'].should.matchAny(/\w+/);
[ 'a', 'b', 'c'].should.matchAny('a');
[ 'a', 'b', 'c'].should.matchEach(/\w+/);
[ 'a', 'a', 'a'].should.matchEach('a');
[ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });

(10).should.not.be.NaN();
NaN.should.be.NaN();

大于
(10).should.be.above(0);
>=
(10).should.be.aboveOrEqual(0);
(10).should.be.aboveOrEqual(10);

小于
(0).should.be.below(10);

小于等于<=
(0).should.be.belowOrEqual(10);
(0).should.be.belowOrEqual(0);

在区间内
(10).should.be.within(0, 20);

空
''.should.be.empty();
[].should.be.empty();
({}).should.be.empty();


key
({ a: 10 }).should.have.keys('a');
({ a: 10, b: 20 }).should.have.keys('a', 'b');
({ a: 10 }).should.have.ownProperty('a');
({ a: 10, b: 20 }).should.have.properties([ 'a' ]);

长度
[1, 2].should.have.length(2);

size 
({ a: 10 }).should.have.size(1);
(new Map([[1, 2]])).should.have.size(1);

以xx结尾
'abca'.should.endWith('a');

以xx开始
'abc'.should.startWith('a');


类型：

Array()
Boolean()
Date()
Error()
Function()
Number()
String()
arguments()
class()


instanceof(constructor, [description])
null()
type(type, [description])
undefined()
```