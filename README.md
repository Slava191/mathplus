# MathPlus

### About

Transforms math expressions into a beautiful look.

## Getting Started

Insert follow code between ```<head></head>```

```
<script src="mathplus/mathplus.js"></script>
<link rel="stylesheet" href="mathplus/mathplus.css">
```


Insert follow code before closing tag ```</body>```

```
<script src="mathplus/mathplus_use.js"></script> 
```

The text that you wish to transform with MathPlus shod be located between ```<mathplus> ... </mathplus>``` tags

## How to use

### Exponentiation

```
x^(y)
```

### Bottom index

```
x_(y)
```

### Square root

```
sqrt(x)
```

### Base of logarithms

```
log(x) 10
```

### Vector arrow

```
vector{x}
```

### Fractions

**!!! use the ```[block][/block]``` in the line where the fraction is placed**

```
[block](a)/(b)+(c)/(b) = (a+c)/(b)[/block]
```

### Systems of two equations

```
system{x+y = 2;x-y=0}
```

### YouTube video

A link to the video can be taken directly from the browser line.

```
[youtube=https://www.youtube.com/watch?v=KPcH1px3pxM] or [youtube=https://youtu.be/KPcH1px3pxM]
```

### Images

```
[img=https://site.com/example.png]
```

### Links

```
[link=https://github.com/Slava191/mathplus]
```

### Bold text

```
[b]Bold text[/b]
```

### Text in frame

```
[r]Text in frame[/r]
```

### Ignore mathplus

```
[nomath]x^2 - not working here[/nomath]
```

### Example

#### Code

```
<mathplus>[block]logx10 + (sqrt(x+1))/(x^2) = 0[/block]</mathplus>
```

#### Result

![alt text](example.png)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
