export const blog1 = `
제목 : JSON.parse vs Response.json()

우선 JSON이란 무엇일까?

JSON(JavaScript Object Notation)는 데이터를 교환하기 위한 텍스트 기반의 데이터 포맷이다. 그 외에 XML도 있는데 JSON 보다 성능이 떨어지고 가독성이 좋지 않아 요즘은 대부분 JSON을 사용한다.



JSON.parse 는 직렬화된 JSON 데이터를 역직렬화 하기 위해 사용된다

// 직렬화
const obj = { name: "hacho", age: 30 };
const jsonStr = JSON.stringify(obj);
console.log(jsonStr); // '{"name":"hacho","age":30}'
// 역직렬화
const obj2 = JSON.parse(jsonStr);
console.log(obj2);
// 콘솔
{
	"name":"hacho",
	"age":30
}


Response.json()도 마찬가지로 JSON 데이터를 역직렬화 하기 위해 사용되지만 방식이 조금 다르다

fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    console.log(data); // { name: "hacho", age: 30 }
  });


어차피 JSON 데이터를 역직렬화 하는 건 둘 다 똑같은데 서버 응답도 JSON.parse()를 사용해서 객체로 변환할 수 없을까?

fetch('/api/user')
  .then(res => JSON.parse(res)); /**** ERROR ****/
왜 이런 문제가 발생할까?



서버는 JSON 데이터를 항상 문자열로 직렬화하여 전송한다. 즉, 네트워크를 통해 전송되는 JSON은 문자열 형태이다.

fetch()는 응답 본문을 네트워크에서 스트림(조각) 형태로 수신한다. 따라서 응답 객체의 body는 전체 JSON 문자열이 아니라, 그 문자열이 아직 도착 중인 ReadableStream으로 표현된다.

res.body는 JSON 문자열 자체가 아니라, 그 문자열을 비동기적으로 제공하는 스트림(ReadbleStream)이다.



그래서 위처럼 JSON.parse 만을 사용해서 역직렬화를 하려 하면 에러가 나는 것이다.



그러면 JSON.parse를 사용해서 서버 응답을 처리할 수는 없을까?

fetch('/api/todo')
    .then((res) => res.text())
    .then((text) => {
        const data = JSON.parse(text);
        console.log(data);
	});

// 출력
{
    "todo": [
        "빨래",
        "청소",
        "장보기"
    ]
}
Response.json() 도 내부적으로 text 메서드로 ReadableStream을 전부 읽고

JSON.parse로 역직렬화를 한다.



결론은 그냥 서버 응답은 res.json을 사용하자`;

export const blog2 = `
제목 : 깔끔한 React 폼, react hook form + zod + shadcn

React 프로젝트를 진행하며, 별도 라이브러리 없이 기본 Hook과 HTML 요소만으로 폼을 만들었다.
그러다 입력해야 할 필드가 많아질수록 상태 관리가 복잡해져서

해결책을 찾아보다가 shadcn/ui의 Form 컴포넌트와 react-hook-form, Zod를 알게 됐다.

react-hook-form?
React 훅 기반의 폼 상태 관리 라이브러리
입력값(value), 유효성 검증, 에러 상태를 비제어 컴포넌트 방식으로 관리해 불필요한 리렌더링을 줄여준다
Zod?
TypeScript 기반의 스키마 선언·런타임 검증 라이브러리
z.object(), z.string() 등으로 스키마만 정의하면
런타임에 데이터를 검증하고
z.infer<typeof schema>로 TS 타입도 자동 생성해 준다
두 라이브러리를 조합하면

폼 상태 관리 → 입력값 취합 → Zod로 스키마 검증 → React Hook Form에 에러 등록

흐름을 쉽게 구현할 수 있다



여기서 shadcn을 사용하면 두 라이브러리 조합을 더 이쁘게 코드를 작성할 수 있다.

예시 코드
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "최소 두 글자",
  }),
})

export function ProfileForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

`;
